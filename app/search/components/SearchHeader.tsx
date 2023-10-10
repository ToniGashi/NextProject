'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchHeader() {
  const router = useRouter();
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
        <button
          className="rounded bg-red-600 px-9 py-2 text-white"
          onClick={() => {
            if (searchBar === '') return;
            router.push(`/search?searchBar=${searchBar}`);
          }}>
          {"Let's go"}
        </button>
      </div>
    </div>
  );
}
