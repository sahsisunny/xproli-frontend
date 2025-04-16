
import React from "react";
import { Layout } from "@/components/Layout";
import { LinkShortener } from "@/components/LinkShortener";
import { LinkList } from "@/components/LinkList";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto">
          <LinkShortener />
        </div>
        <LinkList />
      </div>
    </Layout>
  );
};

export default Index;
