import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsBriefcaseFill } from "react-icons/bs";

import { userStore } from "@/store/user";
import { CompanyStore } from "@/store/company";
import fetchClient from "@/lib/fetch-client";
import { CompanyType } from "@/interface/company";

function CompanyButton() {
  const router = useRouter();
  const { setCurrentCompany } = CompanyStore();
  const { userInfo } = userStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const checkCompany = async () => {
    if (!userInfo || !userInfo?.id) {
      setShowMessage(true);
    } else {
      setShowMessage(false);
      setIsLoading(true);
      try {
        const companies = await fetchClient({
          method: "POST",
          endpoint: "/api/userCompanies",
          body: JSON.stringify({
            userId: userInfo?.id,
          }),
        });

        if (companies?.data?.length > 0) {
          setCurrentCompany(companies?.data[0]);
          router.push("/new/jobs");
        } else {
          router.push("/new/company");
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {!!showMessage && (
        <Alert mb={4} status="warning">
          <AlertIcon />
          Hãy đăng nhập để tiếp tục
        </Alert>
      )}
      <Button
        w={"full"}
        h={12}
        color={"white"}
        fontSize={"0.9rem"}
        bg={"#6562FF"}
        _hover={{ bg: "#6562FF" }}
        isLoading={!!isLoading}
        leftIcon={<BsBriefcaseFill />}
        loadingText="Đang chuyển hướng..."
        onClick={() => checkCompany()}
      >
        Tạo hồ sơ công ty/nhà tuyển dụng
      </Button>
    </>
  );
}

export default CompanyButton;
