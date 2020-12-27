import styled from 'styled-components'
import Link from 'next/link'
import Card from './Card'

export default function ConverterCard({ converter }) {
  const { assetFrom, assetTo } = converter
  return (
    <Card>
      <Link href={`/${assetFrom.toLowerCase()}-to-${assetTo.toLowerCase()}`}>
        <a>Convert to {assetTo}</a>
      </Link>
    </Card>
  )
}
