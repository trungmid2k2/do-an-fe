import type { Job, JobWithSubscribes } from "@/interface/job";
import { dayjs } from "@/utils/dayjs";

export const getDeadlineFromNow = (deadline: string | undefined) =>
  deadline ? dayjs(deadline).locale("vi").fromNow() : "-";

export const formatDeadline = (deadline: string | undefined) =>
  deadline ? dayjs(deadline).format("MMM D, YYYY HH:mm") : "-";

export const isDeadlineOver = (deadline: string | undefined) =>
  deadline ? dayjs().isAfter(dayjs(deadline)) : false;

export const getJobDraftStatus = (
  status: string | undefined,
  isPublished: boolean | undefined
) => {
  if (status !== "OPEN") return "ĐÓNG";
  if (isPublished) return "PUBLISHED";
  return "DRAFT";
};

export const getJobProgress = (job: Job | JobWithSubscribes | null) => {
  if (!job) return "-";
  const rewardsLength = Object.keys(job?.rewards || {})?.length || 0;
  const jobStatus = getJobDraftStatus(job?.status, job?.isPublished);
  if (jobStatus !== "PUBLISHED") return "";
  const hasDeadlinePassed = isDeadlineOver(job?.deadline || "");
  if (!hasDeadlinePassed) return "Trong quá trình";
  if (job?.isWinnersAnnounced && job?.totalPaymentsMade === rewardsLength)
    return "Hoàn thành";
  if (job?.isWinnersAnnounced && job?.totalPaymentsMade !== rewardsLength)
    return "Đang chờ thanh toán";
  if (
    !job?.isWinnersAnnounced &&
    job?.totalWinnersSelected === rewardsLength &&
    job?.totalPaymentsMade === rewardsLength
  )
    return "Hoàn thành thanh toán";
  if (!job?.isWinnersAnnounced && job?.totalWinnersSelected === rewardsLength)
    return "Đã được chọn";
  return "Đang xem xét";
};

export const getBgColor = (status: string) => {
  switch (status) {
    case "PUBLISHED":
    case "COMPLETED":
      return "green";
    case "Đang chờ thanh toán":
      return "green.400";
    case "Đã thanh toán":
      return "green.500";
    case "Đã chọn":
      return "green.300";
    case "Bản nháp":
      return "orange";
    case "Đang xem xét":
      return "brand.purple";
    default:
      return "gray";
  }
};
