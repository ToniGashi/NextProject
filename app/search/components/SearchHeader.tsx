'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { PRICE } from '@prisma/client';

export default function SearchHeader({
  searchParams
}: {
  searchParams: {
    searchBar?: string;
    location?: string;
    cuisine?: string;
    price?: PRICE;
  }}) {
  const [searchBar, setSearchBar] = useState('');

  return (
    <div className="bg-gradient-to-r to-[#5f6984] from-[#0f1f47] p-2">
      <div className="text-left text-lg py-3 m-auto flex justify-center">
        <input
          className="rounded  mr-3 p-2 w-[450px]"
          type="text"
          value={searchBar}
          onChange={(e) => setSearchBar(e.target.value)}
          placeholder="State, city or town"
        />
        <Link
          href={{
            pathname: `/search`,
            query: {
              ...searchParams,
              searchBar: searchBar
            }
          }}>
          <button className="rounded bg-red-600 px-9 py-2 text-white">
            {"Let's go"}
          </button>
        </Link>
      </div>
    </div>
  );
}
