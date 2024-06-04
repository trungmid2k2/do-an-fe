import { type ReactNode } from "react";

import Footer from "@/components/Footer/Footer";
import HeaderAdmin from "@/components/HeaderAdmin/HeaderAdmin";
import { userStore } from "@/store/user";

type IDefaultProps = {
  meta: ReactNode;
  children: ReactNode;
  className?: string;
};

const DeFaultAdmin = (props: IDefaultProps) => {
  const { userInfo } = userStore();

  return (
    <div
      className={
        !props.className ? "min-h-full" : `min-h-full ${props.className}`
      }
    >
      {userInfo?.role === "ADMIN" ? (
        <>
          {props.meta}
          <HeaderAdmin />
          {props.children}
          <Footer />
        </>
      ) : (
        <>
          <div className="w-full h-[100vh]">
            <div className="text-center py-[20%]">
              Bạn không có quyền truy cập trang
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { DeFaultAdmin };

function useSWR(
  arg0: string,
  fetcher: any
): { data: any; error: any; isLoading: any } {
  throw new Error("Function not implemented.");
}
