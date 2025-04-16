
import React from "react";
import { Layout } from "@/components/Layout";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";

const QR = () => {
  return (
    <Layout>
      <QRCodeGenerator />
    </Layout>
  );
};

export default QR;
