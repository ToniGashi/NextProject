import { NextApiRequest, NextApiResponse } from 'next';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { restaurantId, day, time, partySize } = req.query as {
      restaurantId: string;
      day: string;
      time: string;
      partySize: string;
    };

    if (!restaurantId || !day || !partySize || !time) {
      return res.status(400).json({
        errorMessage: 'Invalid data'
      });
    }

    // The restaurant the user was looking for and the useful data for it.
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: restaurantId
      },
      select: {
        id: true,
        tables: {
          select: {
            id: true,
            seats: true
          }
        },
        open_time: true,
        close_time: true
      }
    });

    if (!restaurant) {
      return res.status(400).json({
        errorMessage: 'Invalid data'
      });
    }

    const searchTimesWithTables = await findAvailableTables({
      time,
      day,
      restaurantId,
      res,
      restaurant
    });

    if (!searchTimesWithTables) {
      return res.status(400).json({
        errorMessage: 'Invalid data'
      });
    }

    // Figures out the availabilities for each of the times around the reservation time including the reservation time
    const availabilities = searchTimesWithTables
      .map((timeWithTable) => {
        const sumSeats =
          timeWithTable.tables.reduce((sum, table) => {
            return sum + table.seats;
          }, 0) || 0;

        return {
          time: timeWithTable.time,
          available: sumSeats >= parseInt(partySize)
        };
      })
      .filter((availability) => {
        const timeIsAfterOpenHours =
          `${availability.time}` >= restaurant.open_time;

        const timeIsBeforeCloseHours =
          `${availability.time}` <= restaurant.close_time;

        return timeIsAfterOpenHours && timeIsBeforeCloseHours;
      });

    return res.json({
      availabilities
    });
  }
}
