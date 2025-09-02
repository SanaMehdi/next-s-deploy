'use client'

import { Suspense } from 'react'
import LoginUI from './ui'

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginUI />
    </Suspense>
  )
}