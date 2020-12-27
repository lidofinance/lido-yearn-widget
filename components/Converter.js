import Link from 'next/link'

export default function Converter({ to, from }) {
  return (
    <div>
      <div>
        Converting from {from} to {to}
      </div>
      <Link href="/">
        <a>Back to balances</a>
      </Link>
    </div>
  )
}
