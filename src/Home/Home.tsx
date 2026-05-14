import Section1 from './Section 1'
import Section2 from './Section 2'
import Section3 from './Section 3'
import Section4 from './Section 4'
import Section5 from './Section 5'
import Section6 from './Section 6'

type HomeProps = {
  onRequestQuote?: (productId?: string) => void
}

function Home({ onRequestQuote }: HomeProps) {

  return (
    <>
      <Section1 onRequestQuote={() => onRequestQuote?.()} />
      <Section2 />
      <Section3 onRequestQuote={(productId) => onRequestQuote?.(productId)} />
      <Section4 />
      <Section5 />
      <Section6 />
    </>
  )
}

export default Home
