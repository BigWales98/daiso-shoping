import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${APP_NAME} - ${APP_DESCRIPTION}`,
}


export default async function Home() {
  const latestProducts = await getLatestProducts()
  return (
    <div className="space-y-8">
      <ProductList title="Newest Arrivals" data={latestProducts} />
    </div>
    
  );
}
