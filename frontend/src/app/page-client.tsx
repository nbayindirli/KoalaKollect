'use client';

import Layout from '@/components/Layout';
import { PoolList } from '@/components/PoolList';
import { CreatePoolForm } from '@/components/CreatePoolForm';
import { useKoalaKollect } from '@/hooks/useKoalaKollect';
import { RegisterButtons } from '@/components/RegisterButtons';

export default function HomeClient() {
  const { isCreator, isKoala } = useKoalaKollect();

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="text-3xl font-bold text-koala-black mb-4">
            Welcome to KoalaKollect
          </h1>
          <p className="text-gray-600 max-w-2xl">
            A decentralized crowdfunding platform where creators can raise funds for their projects
            and supporters (Koalas) can pledge to help make them happen.
          </p>
        </section>

        {!isCreator && !isKoala && (
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 mb-4">
              Please register as either a Creator or a Koala to interact with pools.
            </p>
            <RegisterButtons />
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold text-koala-black mb-4">
            Active Pools
          </h2>
          <PoolList />
        </section>

        {isCreator && (
          <section>
            <h2 className="text-2xl font-semibold text-koala-black mb-4">
              Create a Pool
            </h2>
            <CreatePoolForm />
          </section>
        )}
      </div>
    </Layout>
  );
}