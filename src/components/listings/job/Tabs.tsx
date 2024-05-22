/* eslint-disable no-nested-ternary */
import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { JobsCard } from "@/components/misc/listingsCard";
import EmptySection from "@/components/shared/EmptySection";
import Loading from "@/components/shared/Loading";
import type { Job } from "@/interface/job";

interface TabProps {
  id: string;
  title: string;
  content: JSX.Element;
}

interface JobTabsProps {
  isListingsLoading: boolean;
  jobs: { jobs: Job[] };
  take?: number;
}

export const JobTabs = ({
  isListingsLoading,
  jobs,
  take = 10,
}: JobTabsProps) => {
  const tabs: TabProps[] = [
    {
      id: "tab1",
      title: "Đang tuyển",
      content: (
        <Flex direction={"column"} rowGap={1}>
          {isListingsLoading ? (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          ) : jobs?.jobs?.filter(
              (job) => job.status === "OPEN" && !dayjs().isAfter(job.deadline)
            ).length ? (
            jobs.jobs
              .filter(
                (job) => job.status === "OPEN" && !dayjs().isAfter(job.deadline)
              )
              .slice(0, take)
              .map((job) => (
                <JobsCard
                  slug={job.slug}
                  rewardAmount={job?.rewardAmount}
                  key={job?.id}
                  companyName={job?.company?.name}
                  deadline={job?.deadline}
                  title={job?.title}
                  logo={job?.company?.logo}
                  token={job?.token}
                  type={job?.type}
                  applicationType={job.applicationType}
                />
              ))
          ) : (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="Không có bài đăng khả dụng!"
                message="Hãy thử lại sau."
              />
            </Flex>
          )}
        </Flex>
      ),
    },

    {
      id: "tab2",
      title: "Hết hạn",
      content: (
        <Flex direction={"column"} rowGap={"1"}>
          {isListingsLoading ? (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          ) : jobs?.jobs?.filter((job) => job.status === "CLOSED").length ? (
            jobs.jobs
              .filter((job) => job.status === "CLOSED")
              .slice(0, 10)
              .map((job) => (
                <JobsCard
                  slug={job.slug}
                  rewardAmount={job?.rewardAmount}
                  key={job?.id}
                  companyName={job?.company?.name}
                  deadline={job?.deadline}
                  title={job?.title}
                  logo={job?.company?.logo}
                  token={job?.token}
                  type={job?.type}
                  applicationType={job.applicationType}
                />
              ))
          ) : (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="No jobs announced!"
                message="Subscribes to notifications to get notified about announcements."
              />
            </Flex>
          )}
        </Flex>
      ),
    },
  ];
  return tabs;
};
