import { useDisclosure } from "@chakra-ui/react";
// import { Regions } from '@prisma/client';
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import type { JobBasicType } from "@/components/listings/job/Createjob";
import { CreateJob } from "@/components/listings/job/Createjob";
import type {
  Ques,
  QuestionType,
} from "@/components/listings/job/questions/builder";
// import { CreateGrants } from "@/components/listings/grants/CreateGrants";
import Template from "@/components/listings/template/template";
import { SuccessListings } from "@/components/modals/successListings";
import ErrorSection from "@/components/shared/ErrorSection";
import type { MultiSelectOptions } from "@/constants";
import type { Job, References } from "@/interface/job";
import type { GrantsBasicType } from "@/interface/listings";
import FormLayout from "@/layouts/FormLayout";
import { userStore } from "@/store/user";
import { getJobDraftStatus } from "@/utils/job";
import { dayjs } from "@/utils/dayjs";
import { mergeSkills, splitSkills } from "@/utils/skills";
import fetchClient from "@/lib/fetch-client";

interface Props {
  job?: Job;
  isEditMode?: boolean;
  type: "open" | "permissioned";
}

function CreateListing({ job, isEditMode = false, type }: Props) {
  const router = useRouter();
  const { userInfo } = userStore();
  // Templates - 1
  // Basic Info - 2
  // Description - 3
  // payment form - 4
  const [steps, setSteps] = useState<number>(isEditMode ? 2 : 1);
  const [listingType, setListingType] = useState("JOB");
  const [draftLoading, setDraftLoading] = useState<boolean>(false);
  const [jobRequirements, setJobRequirements] = useState<string | undefined>(
    isEditMode ? job?.requirements : undefined
  );
  const [editorData, setEditorData] = useState<string | undefined>(
    isEditMode ? job?.description : undefined
  );
  const [regions, setRegions] = useState<any>(
    isEditMode ? job?.region || `GLOBAL` : `GLOBAL`
  );
  const skillsInfo = isEditMode ? splitSkills(job?.skills || []) : undefined;
  const [mainSkills, setMainSkills] = useState<MultiSelectOptions[]>(
    isEditMode ? skillsInfo?.skills || [] : []
  );
  const [subSkill, setSubSkill] = useState<MultiSelectOptions[]>(
    isEditMode ? skillsInfo?.subskills || [] : []
  );
  const [slug, setSlug] = useState<string>("");

  const { isOpen, onOpen } = useDisclosure();

  const [questions, setQuestions] = useState<Ques[]>(
    isEditMode
      ? (job?.eligibility || [])?.map((e) => ({
          order: e.order,
          question: e.question,
          type: e.type as QuestionType,
          delete: true,
          label: e.question,
        }))
      : []
  );

  const [references, setReferences] = useState<References[]>(
    isEditMode
      ? (job?.references || [])?.map((e) => ({
          order: e.order,
          link: e.link,
        }))
      : []
  );

  // - Job
  const [jobbasic, setJobBasic] = useState<JobBasicType | undefined>({
    title: isEditMode ? job?.title || undefined : undefined,
    deadline:
      isEditMode && job?.deadline
        ? dayjs(job?.deadline).format("YYYY-MM-DDTHH:mm") || undefined
        : undefined,
    templateId: isEditMode ? job?.templateId || undefined : undefined,
    pocSocials: isEditMode ? job?.pocSocials || undefined : undefined,
    applicationType: isEditMode ? job?.applicationType || "fixed" : "fixed",
    timeToComplete: isEditMode ? job?.timeToComplete || undefined : undefined,
  });
  const [jobPayment, setJobPayment] = useState({
    rewardAmount: isEditMode ? job?.rewardAmount || 0 : 0,
    token: isEditMode ? job?.token : undefined,
    rewards: isEditMode ? job?.rewards || undefined : undefined,
  });
  // -- Grants
  // const [grantBasic, setgrantsBasic] = useState<GrantsBasicType | undefined>();

  const [isListingPublishing, setIsListingPublishing] =
    useState<boolean>(false);

  const createAndPublishListing = async () => {
    setIsListingPublishing(true);
    try {
      const newJob: Job = {
        companyId: userInfo?.currentCompany?.id ?? 0,
        pocId: userInfo?.id ?? 0,
        skills: mergeSkills({ skills: mainSkills, subskills: subSkill }),
        ...jobbasic,
        deadline: jobbasic?.deadline
          ? new Date(jobbasic?.deadline).toISOString()
          : undefined,
        description: editorData || "",
        type,
        pocSocials: jobbasic?.pocSocials,
        region: regions,
        eligibility: (questions || []).map((q) => ({
          question: q.question,
          order: q.order,
          type: q.type,
        })),
        references: (references || []).map((r) => ({
          link: r.link,
          order: r.order,
        })),
        requirements: jobRequirements,
        ...jobPayment,
        isPublished: true,
      };
      const result = await fetchClient({
        method: "POST",
        endpoint: "/api/jobs/create",
        body: JSON.stringify(newJob),
      });
      setSlug(`/jobs/${result?.data?.slug}/`);
      onOpen();
      setIsListingPublishing(false);
    } catch (e) {
      setIsListingPublishing(false);
    }
  };

  const createDraft = async () => {
    setDraftLoading(true);
    let api = "/api/jobs/create";
    if (isEditMode) {
      api = `/api/jobs/update`;
    }
    let draft: Job = {
      companyId: userInfo?.currentCompany?.id ?? 0,
      pocId: userInfo?.id ?? 0,
    };
    draft = {
      ...draft,
      skills: mergeSkills({ skills: mainSkills, subskills: subSkill }),
      ...jobbasic,
      deadline: jobbasic?.deadline
        ? new Date(jobbasic?.deadline).toISOString()
        : undefined,
      description: editorData || "",
      eligibility: (questions || []).map((q) => ({
        question: q.question,
        order: q.order,
        type: q.type,
      })),
      references: (references || []).map((r) => ({
        link: r.link,
        order: r.order,
      })),
      pocSocials: jobbasic?.pocSocials,
      region: regions,
      requirements: jobRequirements,
      ...jobPayment,
    };
    try {
      const result = await fetchClient({
        method: "POST",
        endpoint: api,
        body: JSON.stringify({
          jobId: job?.id,
          data: {
            ...draft,
            isPublished: isEditMode ? job?.isPublished : false,
          },
        }),
      });

      // if (isEditMode) {
      //   await axios.post('/api/email/manual/jobUpdate', {
      //     id: job?.id,
      //   });
      // }
      router.push("/dashboard/jobs");
    } catch (e) {
      setDraftLoading(false);
    }
  };

  const newJob = job?.id === undefined;

  const jobDraftStatus = getJobDraftStatus(job?.status, job?.isPublished);

  const isNewOrDraft = jobDraftStatus === "DRAFT" || newJob === true;

  return (
    <>
      {!userInfo?.id ||
      !(userInfo?.role === "GOD" || !!userInfo?.currentCompanyId) ? (
        <ErrorSection
          title="Access is Forbidden!"
          message="Please contact support to access this section."
        />
      ) : (
        <FormLayout
          setStep={setSteps}
          currentStep={steps}
          stepList={
            listingType !== "JOB"
              ? [
                  {
                    label: "Bản mẫu",
                    number: 1,
                    mainHead: "Danh sách cơ hội",
                    description:
                      'Để tiết kiệm thời gian, hãy xem các mẫu làm sẵn của chúng tôi dưới đây. Nếu bạn đã có danh sách ở nơi khác, hãy sử dụng "Bắt đầu từ đầu" và sao chép/dán văn bản của bạn.',
                  },
                  {
                    label: "Cơ bản",
                    number: 2,
                    mainHead: "Tạo danh sách",
                    description: `Bây giờ hãy tìm hiểu thêm một chút về công việc bạn cần hoàn thành`,
                  },
                  {
                    label: "Mô tả",
                    number: 3,
                    mainHead: "Hãy cho chúng tôi biết thêm",
                    description:
                      "Thêm thông tin chi tiết về cơ hội, yêu cầu gửi, chi tiết (các) phần thưởng và tài nguyên",
                  },
                  {
                    label: "Phần thưởng",
                    number: 4,
                    mainHead: "Thêm khoảng tiền thưởng",
                    description: "Quyết định số tiền bồi thường cho danh sách",
                  },
                ]
              : [
                  {
                    label: "Bản mẫu",
                    number: 1,
                    mainHead: "Danh sách cơ hội",
                    description:
                      'Để tiết kiệm thời gian, hãy xem các mẫu làm sẵn của chúng tôi dưới đây. Nếu bạn đã có danh sách ở nơi khác, hãy sử dụng "Bắt đầu từ đầu" và sao chép/dán văn bản của bạn.',
                  },
                  {
                    label: "Cơ bản",
                    number: 2,
                    mainHead: "Tạo danh sách",
                    description: `Bây giờ hãy tìm hiểu thêm một chút về công việc bạn cần hoàn thành`,
                  },
                  {
                    label: "Mô tả",
                    number: 3,
                    mainHead: "Hãy cho chúng tôi biết thêm",
                    description:
                      "Thêm thông tin chi tiết về cơ hội, yêu cầu gửi, chi tiết (các) phần thưởng và tài nguyên",
                  },
                  {
                    label: "Câu hỏi",
                    number: 4,
                    mainHead: "Nhập câu hỏi",
                    description: "Bạn muốn biết gì về ứng viên của mình?",
                  },
                  {
                    label: "Tiền lương",
                    number: 5,
                    mainHead: "Thêm tiền lương",
                    description: "Quyết định số tiền bồi thường cho danh sách",
                  },
                ]
          }
        >
          {isOpen && (
            <SuccessListings slug={slug} isOpen={isOpen} onClose={() => {}} />
          )}
          {steps === 1 && (
            <Template
              setSteps={setSteps}
              setListingType={setListingType}
              setEditorData={setEditorData}
              setSubSkills={setSubSkill}
              setMainSkills={setMainSkills}
              setJobBasic={setJobBasic}
              type={type}
            />
          )}
          {steps > 1 && listingType === "JOB" && (
            <CreateJob
              type={type}
              regions={regions}
              setRegions={setRegions}
              setJobRequirements={setJobRequirements}
              jobRequirements={jobRequirements}
              createAndPublishListing={createAndPublishListing}
              isListingPublishing={isListingPublishing}
              jobPayment={jobPayment}
              setJobPayment={setJobPayment}
              questions={questions}
              setQuestions={setQuestions}
              references={references}
              setReferences={setReferences}
              draftLoading={draftLoading}
              createDraft={createDraft}
              jobbasic={jobbasic}
              setJobBasic={setJobBasic}
              onOpen={onOpen}
              setSubSkills={setSubSkill}
              subSkills={subSkill}
              setMainSkills={setMainSkills}
              mainSkills={mainSkills}
              editorData={editorData}
              setEditorData={setEditorData}
              setSteps={setSteps}
              steps={steps}
              isEditMode={isEditMode}
              isNewOrDraft={isNewOrDraft}
            />
          )}

          <Toaster />
        </FormLayout>
      )}
    </>
  );
}

export default CreateListing;
