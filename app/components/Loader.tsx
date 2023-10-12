import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
  return (
    <div className="px-2 py-9 h-[600px] flex justify-center align-middle">
      <CircularProgress />
    </div>
  )
}
