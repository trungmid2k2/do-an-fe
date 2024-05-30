import { ResetPassword } from "@/components/resetPassword/ResetPassword";
import usePasswordResetStore from "@/store/passwordReset";

import React, { useState } from "react";

type Props = {};

export default function Index({}: Props) {
  const passwordResetData = usePasswordResetStore(
    (state: any) => state.passwordResetData
  );

  return (
    <>
      {passwordResetData ? (
        <ResetPassword />
      ) : (
        <>
          <div
            style={{
              textAlign: "center",
              fontSize: "4rem",
              color: "red",
              marginTop: "10% ",
            }}
          >
            <div> Có lỗi xảy ra</div>
            <br />
            <div>Không tìm thấy trang bạn tìm</div>
          </div>
        </>
      )}
    </>
  );
}
