import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { userStore } from "@/store/user";

function TalentButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { userInfo }: any = userStore();
  const checkTalent = async () => {
    if (!userInfo || !userInfo?.id) {
      setShowMessage(true);
    } else {
      setShowMessage(false);
      setIsLoading(true);
      try {
        if (!userInfo?.isTalentFilled) {
          router.push("/new/talent");
        } else {
          router.push("/");
        }
      } catch (error) {
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
        leftIcon={<FaUser />}
        loadingText="Đang chuyển hướng..."
        onClick={() => checkTalent()}
      >
        Tạo hồ sơ của bạn
      </Button>
    </>
  );
}

export default TalentButton;
