import React from 'react'
import { Navigate, useNavigate } from 'react-router'

function GoBackButton() {
    const navigate = useNavigate();
  return (
<button
  onClick={() => navigate(-1)}
  className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
>
  ← Go Back
</button>
  )
}

export default GoBackButton
