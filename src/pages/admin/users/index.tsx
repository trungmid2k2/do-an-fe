import React, { use, useEffect, useRef, useState } from "react";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import axios from "axios";
import { BACKEND_URL } from "@/env";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { AiFillEdit } from "react-icons/ai";
import { InputField } from "@/components/Form/InputField";
import { Form, useForm } from "react-hook-form";
import { PoW } from "@/interface/pow";
import { socials } from "@/components/Talent/YourLinks";
import { SocialInput } from "@/components/Form/SocialInput";
const debounce = require("lodash.debounce");
const { MediaPicker } = require("degen");
import makeAnimated from "react-select/animated";
import {
  CityList,
  IndustryList,
  MultiSelectOptions,
  workExp,
  workType,
} from "@/constants";
import ReactSelect from "react-select";
import { SelectBox } from "@/components/Form/SelectBox";
import { uploadToCloudinary } from "@/utils/upload";
import { useRouter } from "next/router";
import { SkillList, SubSkillsType } from "@/interface/skills";
import fetchClient from "@/lib/fetch-client";

type FormData = {
  photo?: string;
  firstname?: string;
  lastname?: string;
  interests?: { value: string }[];
  bio?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  telegram?: string;
  experience?: string;
  location?: string;
  workPrefernce?: string;
  currentEmployer?: string;
  pow?: string;
  skills?: any;
  private: boolean;
  PoW?: PoW[];
};

const socialLinkFields = [
  "twitter",
  "github",
  "linkedin",
  "website",
  "telegram",
];
const keysToOmit = [
  "id",
  "email",
  "created_at",
  "isVerified",
  "role",
  "totalEarned",
  "isTalentFilled",
  "superteamLevel",
  "notifications",
  "currentCompanyId",
  "userCompanies",
  "currentCompany",
  "poc",
  "Comment",
  "Subscribe",
  "Grants",
  "UserInvites",
  "SubscribesJob",
];

const parseSkillsAndSubskills = (skillsObject: any) => {
  const skills: MultiSelectOptions[] = [];
  const subSkills: MultiSelectOptions[] = [];

  skillsObject.forEach((skillItem: { skills: string; subskills: string[] }) => {
    skills.push({ value: skillItem.skills, label: skillItem.skills });
    skillItem.subskills.forEach((subSkill) => {
      subSkills.push({ value: subSkill, label: subSkill });
    });
  });

  return { skills, subSkills };
};

export default function User() {
  const [listUser, setListUser] = useState([]);
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();
  // const [jobs, setJob] = useState([]);
  const [pow, setPow] = useState<PoW[]>([]);
  const [skills, setSkills] = useState<MultiSelectOptions[]>([]);
  const [subSkills, setSubSkills] = useState<MultiSelectOptions[]>([]);
  const toast = useToast();
  const [totalUser, setTotalUser] = useState(0);
  const [searchText, setSearchText] = useState("");
  const debouncedSetSearchText = useRef(debounce(setSearchText, 300)).current;
  const [skip, setSkip] = useState(0);
  const length = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FormData | any>(null);
  const [discordError, setDiscordError] = useState(false);
  const [socialError, setSocialError] = useState(false);
  const [isAnySocialUrlInvalid, setAnySocialUrlInvalid] = useState(false);
  const socialLinksValidityRef = useRef<{ [key: string]: boolean }>({});
  const animatedComponents = makeAnimated();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(true);
  const [DropDownValues, setDropDownValues] = useState<{
    interests: string;
  }>({ interests: JSON.stringify(currentUser?.interests || []) });
  const editableFields = Object.keys(currentUser || {}) as (keyof FormData)[];

  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const handleUrlValidation = (isValid: boolean, field: keyof FormData) => {
    socialLinksValidityRef.current[field] = isValid;

    const allUrlsValid = socialLinkFields.every(
      (f) => socialLinksValidityRef.current[f as keyof FormData]
    );

    setAnySocialUrlInvalid(!allUrlsValid);
  };

  const onClose = () => {
    setIsOpen(false);
  };
  const onOpen = (user: any) => {
    setCurrentUser(user);
    setIsOpen(true);
  };

  const getListUser = async () => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(
        `${BACKEND_URL}/api/user/get_all_users?skip=${skip}&take=${length}&searchText=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.data;
      setTotalUser(data.total);
      // console.log("data.total", data);
      setListUser(data.data);
    } catch (error) {
      console.error("Error ", error);
    }
  };

  const deleteUser = async (id: any) => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.delete(`${BACKEND_URL}/api/user/delete`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          id,
        },
      });
      toast({
        title: "Thành công!",
        description: "Xóa thành công!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      getListUser();
    } catch (error) {
      console.error("Error ", error);
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    getListUser();
  }, [skip, searchText]);

  // useEffect(() => {
  //   if (currentUser) {
  //     editableFields.forEach((field) => {
  //       setValue(field, currentUser[field]);
  //     });

  //     if (currentUser.interests) {
  //       const interestsArray = JSON.parse(currentUser.interests);
  //       const defaultInterests = interestsArray.map((value: string) =>
  //         IndustryList.find((option) => option.value === value)
  //       );
  //       setValue("interests", defaultInterests);
  //       setDropDownValues((prev) => ({
  //         ...prev,
  //         interests: defaultInterests,
  //       }));
  //     }

  //     setValue("experience", currentUser.experience || "");
  //     setValue("location", currentUser.location || "");

  //     setValue("interests", currentUser.interests || []);
  //     setValue("photo", currentUser.photo);
  //     setPhotoUrl(currentUser?.photo);
  //     if (currentUser?.skills && Array.isArray(currentUser.skills)) {
  //       const { skills: parsedSkills, subSkills: parsedSubSkills } =
  //         parseSkillsAndSubskills(currentUser.skills);
  //       setSkills(parsedSkills);
  //       setSubSkills(parsedSubSkills);
  //     }
  //   }
  // }, [currentUser, setValue]);

  // const onSubmit = async (data: FormData) => {
  //   try {
  //     if (!data.discord) {
  //       setDiscordError(true);
  //       toast({
  //         title: "Lỗi Discord",
  //         description: "Yêu cầu có Discord",
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //       });
  //       return;
  //     }
  //     setDiscordError(false);

  //     const filledSocialLinksCount = socialLinkFields.filter(
  //       (field) => data[field as keyof FormData]
  //     ).length;

  //     setSocialError(filledSocialLinksCount < 1);

  //     if (filledSocialLinksCount < 1) {
  //       toast({
  //         title: "Đường dẫn bị lỗi",
  //         description: "Ít nhất phải có một mạng xã hội",
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //       });
  //       return;
  //     }

  //     if (isAnySocialUrlInvalid) {
  //       toast({
  //         title: "URL xã hội không hợp lệ",
  //         description: "URL xã hội không hợp lệ",
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //       });
  //       return;
  //     }

  //     const interestsJSON = JSON.stringify(
  //       (data.interests || []).map((interest) => interest.value)
  //     );

  //     const combinedSkills = skills.map((mainskill) => {
  //       const main = SkillList.find(
  //         (skill: any) => skill.mainskill === mainskill.value
  //       );
  //       const sub: SubSkillsType[] = [];

  //       subSkills.forEach((subskill: any) => {
  //         if (
  //           main &&
  //           main.subskills.includes(subskill.value as SubSkillsType)
  //         ) {
  //           sub.push(subskill.value as SubSkillsType);
  //         }
  //       });

  //       return {
  //         skills: main?.mainskill ?? "",
  //         subskills: sub ?? [],
  //       };
  //     });

  //     const updatedData = {
  //       ...data,
  //       interests: interestsJSON,
  //       skills: combinedSkills,
  //     };

  //     const finalUpdatedData = Object.keys(updatedData).reduce((acc, key) => {
  //       const fieldKey = key as keyof FormData;
  //       if (
  //         currentUser &&
  //         updatedData[fieldKey] !== currentUser[fieldKey] &&
  //         !keysToOmit.includes(key)
  //       ) {
  //         acc[fieldKey] = updatedData[fieldKey];
  //       }
  //       return acc;
  //     }, {} as Partial<FormData>);
  //     const response = await fetchClient({
  //       method: "POST",
  //       endpoint: "/api/user/edit",
  //       body: JSON.stringify({
  //         id: currentUser?.id,
  //         ...finalUpdatedData,
  //       }),
  //     });

  //     toast({
  //       title: "Hồ sơ đã được cập nhật.",
  //       description: "Hồ sơ của bạn đã được cập nhật thành công!",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Cập nhật thất bại",
  //       description:
  //         "Có thể một vài trường bị lỗi. Vui lòng kiểm tra lại thông tin của bạn và thử lại.",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   }
  // };

  return (
    <LayoutAdmin>
      <Flex align="center" justify="space-between">
        <div>Danh sách người dùng</div>
        <div>
          <FormControl>
            <Input
              onChange={(e) => {
                debouncedSetSearchText(e.target.value);
                console.log(e.target.value);
              }}
              placeholder="Tìm kiếm..."
            />
          </FormControl>
        </div>
      </Flex>
      <br></br>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>STT</Th>
              <Th>Tên tài khoản</Th>
              <Th>Gmail</Th>
              <Th>Tên</Th>
              <Th>Địa chỉ</Th>
              <Th>Kinh nghiệm</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {listUser.map((user: any, index: number) => {
              return (
                <Tr key={index + user?.username}>
                  <Td>{index + 1}</Td>
                  <Td>{user?.username || ""}</Td>
                  <Td> {user?.email || ""}</Td>
                  <Td>{user?.firstname + " " + user?.lastname}</Td>
                  <Td> {user?.location || ""}</Td>
                  <Td> {user?.experience || ""}</Td>
                  <Td>
                    <Button
                      leftIcon={<DeleteIcon w={2} h={2} />}
                      onClick={() => deleteUser(user.id)}
                      size="xs"
                      colorScheme="red"
                      variant="solid"
                    >
                      Xóa
                    </Button>
                    {/* <Button
                      leftIcon={<AiFillEdit />}
                      ml={1}
                      size="xs"
                      variant="solid"
                      onClick={() => onOpen(user)}
                    >
                      Sửa
                    </Button> */}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex align="center" justify="end" mt={6}>
        <Text mr={4} color="brand.slate.400" fontSize="sm">
          <Text as="span" fontWeight={700}>
            {skip + 1}
          </Text>{" "}
          -{" "}
          <Text as="span" fontWeight={700}>
            {Math.min(skip + length, totalUser)}
          </Text>{" "}
          của{" "}
          <Text as="span" fontWeight={700}>
            {totalUser}
          </Text>{" "}
          Người dùng
        </Text>
        <Button
          mr={4}
          isDisabled={skip <= 0}
          leftIcon={<ChevronLeftIcon w={5} h={5} />}
          onClick={() => (skip >= length ? setSkip(skip - length) : setSkip(0))}
          size="sm"
          variant="outline"
        >
          Trước
        </Button>
        <Button
          isDisabled={
            totalUser < skip + length || (skip > 0 && skip % length !== 0)
          }
          onClick={() => skip % length === 0 && setSkip(skip + length)}
          rightIcon={<ChevronRightIcon w={5} h={5} />}
          size="sm"
          variant="outline"
        >
          Tiếp
        </Button>
      </Flex>
      {/* <Modal
        // initialFocusRef={initialRef}
        // finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Sửa người dùng</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormLabel
                  mb={"0"}
                  pb={"0"}
                  color={"brand.slate.500"}
                  requiredIndicator={<></>}
                >
                  Ảnh đại diện
                </FormLabel>
                <MediaPicker
                  defaultValue={{ url: photoUrl, type: "image" }}
                  onChange={async (e: any) => {
                    setUploading(true);
                    const a = await uploadToCloudinary(e);
                    setValue("photo", a);
                    setUploading(false);
                  }}
                  onReset={() => {
                    setValue("photo", "");
                    setUploading(false);
                  }}
                  compact
                  label="Chọn hoặc kéo thả ảnh vào đây"
                />

                <InputField
                  label="Tên"
                  placeholder="Tên"
                  name="firstname"
                  register={register}
                  isRequired
                />

                <InputField
                  label="Họ"
                  placeholder="Họ"
                  name="lastname"
                  register={register}
                  isRequired
                />
                <Box w={"full"} mb={"1.25rem"}>
                  <FormLabel color={"brand.slate.500"}>Tiểu sử</FormLabel>
                  <Textarea
                    borderColor="brand.slate.300"
                    _placeholder={{
                      color: "brand.slate.300",
                    }}
                    focusBorderColor="brand.purple"
                    id={"bio"}
                    maxLength={180}
                    placeholder="Tiểu sử"
                    {...register("bio", { required: true })}
                  />
                  <Text
                    color={
                      (watch("bio")?.length || 0) > 160
                        ? "red"
                        : "brand.slate.400"
                    }
                    fontSize={"xs"}
                    textAlign="right"
                  >
                    còn {180 - (watch("bio")?.length || 0)} kí tự
                  </Text>
                  <Text mt={8} mb={5} fontSize="xl">
                    Xã hội
                  </Text>

                  {socials.map((sc, idx: number) => {
                    return (
                      <SocialInput
                        name={sc.label.toLowerCase()}
                        register={register}
                        {...sc}
                        key={`sc${idx}`}
                        discordError={
                          sc.label.toLowerCase() === "discord"
                            ? discordError
                            : false
                        }
                        watch={watch}
                        onUrlValidation={(isValid) => {
                          handleUrlValidation(
                            isValid,
                            sc.label.toLowerCase() as keyof FormData
                          );
                        }}
                      />
                    );
                  })}
                  {socialError && (
                    <Text color="red">Có ít nhất một mạng xã hội!</Text>
                  )}
                </Box>
                <Box w={"full"} mb={"1.25rem"}>
                  <FormLabel color={"brand.slate.500"}>
                    Lĩnh vực web3?
                  </FormLabel>
                  <ReactSelect
                    placeholder="Chọn"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={IndustryList as any}
                    value={DropDownValues.interests}
                    required
                    onChange={(selectedOptions: any) => {
                      const selectedInterests = selectedOptions
                        ? selectedOptions.map(
                            (elm: { label: string; value: string }) => elm
                          )
                        : [];
                      setDropDownValues({
                        ...DropDownValues,
                        interests: selectedInterests,
                      });
                      setValue("interests", selectedInterests);
                    }}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: "brand.slate.500",
                        borderColor: "brand.slate.300",
                      }),
                    }}
                  />
                </Box>
                <SelectBox
                  label="Kinh nghiệm việc làm"
                  watchValue={watch("experience")}
                  options={workExp}
                  id="experience"
                  placeholder="Chọn"
                  register={register}
                />

                <SelectBox
                  label="Vị trí"
                  watchValue={watch("location")}
                  options={CityList}
                  id="location"
                  placeholder="Chọn thành phố"
                  register={register}
                />

                <SelectBox
                  label="Sở thích về công việc"
                  watchValue={watch("workPrefernce")}
                  options={workType}
                  id="workPrefernce"
                  placeholder="Loại"
                  register={register}
                />

                <InputField
                  label="Công việc hiện tại"
                  placeholder="Employer"
                  name="currentEmployer"
                  register={register}
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button type="submit" colorScheme="blue" mr={3}>
                  Sửa
                </Button>
                <Button onClick={onClose}>Hủy</Button>
              </ModalFooter>
            </ModalContent>
          </FormControl>
        </form>
      </Modal> */}
    </LayoutAdmin>
  );
}
