import { NextApiRequest, NextApiResponse } from 'next';
import { reservationTimes } from '../../../../data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  // The alternative times around the reservation time
  const searchTimes = reservationTimes.find((t) => {
    return t.time === time;
  })?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({
      errorMessage: 'Invalid data'
    });
  }

  // The bookings in the times around the reservation time including the reservation time
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: `${day}T${searchTimes[0]}`,
        lte: `${day}T${searchTimes[searchTimes.length - 1]}`
      }
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true
    }
  });

  const bookingsTablesObj: {
    [key: string]: {
      [key: number]: true;
    };
  } = {};

  // Fill bookingTablesObject with data in the following format: {dateTime: { tabledId: true }} in order to figure out which tables are used at which time in an easy way
  bookings.forEach((booking) => {
    bookingsTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.table_id]: true
        };
      }, {});
  });

  if (!restaurantId) {
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

  const tables = restaurant.tables;

  // Gets the times around the reservation and figures out what tables are available at each of these times.
  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      //tables: tables
      tables: tables.filter(
        (table) => !bookingsTablesObj[`${day}T${searchTime}`]?.[table.id]
      )
    };
  });

  // Figures out the availabilities for each of the times around the reservation time including the reservation time
  const availabilities = searchTimesWithTables
    .map((timeWithTable) => {
      const sumSeats =
        timeWithTable.tables.reduce((sum, table) => {
          return sum + table.seats;
        }, 0) || 0;

      return {
        time: timeWithTable.time,
        availabile: sumSeats >= parseInt(partySize)
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
