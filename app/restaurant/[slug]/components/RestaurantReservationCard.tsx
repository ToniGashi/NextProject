'use client';

import { partySizes, reservationTimes } from '../../../../data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import useAvailabilities from '../../../../hooks/useAvailabilities';
import Loader from '../../../components/Loader';
import Link from 'next/link';

const getRoundedTimeDate = () => {
  let coeff = 1000 * 60 * 30;
  let date = new Date();
  return new Date(Math.round(date.getTime() / coeff) * coeff);
};

export default function RestaurantReservationCard({
  slug,
  openTime,
  closeTime
}: {
  slug: string;
  openTime: string;
  closeTime: string;
}) {
  const [date, setDate] = useState<Date>(getRoundedTimeDate());
  const [selectedPartySize, setSelectedPartySize] = useState(2);
  const [time, setTime] = useState(openTime);
  const { loading, availabilites, error, fetchAvailabilities } =
    useAvailabilities();

  const filteredTimes = reservationTimes.filter(
    (timeObject) => timeObject.time > openTime && timeObject.time < closeTime
  );

  return (
    <div className="fixed bg-white rounded w-[30%] md:w-[15%] bottom-3 p-3 text-2xsm md:text-reg shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-sm md:text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          onChange={(e) => setSelectedPartySize(parseInt(e.target.value))}>
          {partySizes.map((currentPartySize) => (
            <option key={currentPartySize.value} value={currentPartySize.value}>
              {currentPartySize.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex flex-col w-1/2">
          <label>Date</label>
          <DatePicker
            selected={date}
            dateFormat="dd MMM"
            onChange={(newDate) => setDate(newDate)}
            className="py-3 border-b font-light md:text-reg w-full"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label>Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}>
            {filteredTimes.map((time) => (
              <option key={time.time} value={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="h-20">
          <Loader />
        </div>
      ) : (
        <div className="mt-5">
          <button
            className="bg-red-600 rounded w-full px-1 md:px-4 text-white font-bold h-10 md:h-16"
            onClick={() =>
              fetchAvailabilities({
                slug,
                date: date.toISOString(),
                time,
                partySize: selectedPartySize
              })
            }>
            Find a Time
          </button>
          {availabilites && (
            <div className="flex flex-wrap gap-0.5 mt-2">
              {availabilites.map(({ time }) => (
                <Link
                  href={`/reserve/${slug}?date=${date}T${time}&partySize=${selectedPartySize}`}
                  key={time}
                  className="bg-red-600 rounded text-white px-2 py-1 text-reg ">
                  {time.substring(0, 5)}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
