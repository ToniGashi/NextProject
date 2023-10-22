import { NextApiResponse } from 'next';
import { reservationTimes } from '../../data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  time,
  day,
  restaurantId,
  res,
  restaurant
}: {
  time: string;
  day: string;
  restaurantId: string;
  res: NextApiResponse;
  restaurant: {
    id: number;
    tables: {
      id: number;
      seats: number;
    }[];
    open_time: string;
    close_time: string;
  };
}) => {
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
    const dateID = booking.booking_time.toISOString();
    if (bookingsTablesObj[dateID]) {
      bookingsTablesObj[dateID] = {
        ...bookingsTablesObj[dateID],
        ...booking.tables.reduce((obj, table) => {
          return {
            ...obj,
            [table.table_id]: true
          };
        }, {})
      };
    } else {
      bookingsTablesObj[dateID] = booking.tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.table_id]: true
        };
      }, {});
    }
  });

  if (!restaurantId) {
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

  return searchTimesWithTables;
};
