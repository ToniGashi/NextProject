import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { partySize, day, time, restaurantId } = req.query as {
      restaurantId: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest
    } = req.body;

    if (!partySize || !day || !time || !restaurantId) {
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

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res.status(400).json({
        errorMessage: 'Invalid date'
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

    const searchTimeWithTables = searchTimesWithTables.find((t) => {
      return (
        new Date(t.date).toISOString() ===
        new Date(`${day}T${time}`).toISOString()
      );
    });

    if (!searchTimeWithTables) {
      return res.status(400).json({
        errorMessage: 'No availability, cannot book.'
      });
    }

    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: []
    };

    // We are assuming that tables can either be for 2 or 4 people.
    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining -= 4;
        } else {
          if (tablesCount[2].length) {
            tablesToBook.push(tablesCount[2][0]);
            tablesCount[2].shift();
            seatsRemaining -= 2;
          } else {
            return res.status(400).json({
              errorMessage: 'No availability, cannot book.'
            });
          }
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining -= 2;
        } else {
          if (tablesCount[4].length) {
            tablesToBook.push(tablesCount[4][0]);
            tablesCount[4].shift();
            seatsRemaining -= 4;
          } else {
            return res.status(400).json({
              errorMessage: 'No availability, cannot book.'
            });
          }
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_requests: bookerRequest,
        restaurant_id: restaurant.id
      }
    });

    const bookingsOnTablesData = tablesToBook.map((tableId) => {
      return {
        table_id: tableId,
        booking_id: booking.id
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData
    });

    return res.json({
      booking
    });
  }
}
