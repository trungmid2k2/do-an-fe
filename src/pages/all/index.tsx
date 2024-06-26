import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { JobsCard, ListingSection } from "@/components/misc/listingsCard";
import EmptySection from "@/components/shared/EmptySection";
import Loading from "@/components/shared/Loading";
import type { Job } from "@/interface/job";
import Home from "@/layouts/Home";
import axios from "@/lib/axios";

interface Listings {
  jobs?: Job[];
}

function AllListingsPage() {
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [listings, setListings] = useState<Listings>({
    jobs: [],
  });

  const getListings = async () => {
    setIsListingsLoading(true);
    try {
      const listingsData = await axios.get("/api/listings", {
        params: {
          category: "jobs",
          take: 100,
        },
      });
      const data = await listingsData.data;
      setListings(data.data);
      setIsListingsLoading(false);
    } catch (e) {
      setIsListingsLoading(false);
    }
  };

  useEffect(() => {
    if (!isListingsLoading) return;
    getListings();
  }, []);

  return (
    <Home type="home">
      <Box w={"100%"}>
        <ListingSection
          type="jobs"
          title="Bài đăng Freelance"
          sub=" "
          emoji="/assets/home/emojis/moneyman.png"
          all
        >
          {isListingsLoading && (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          )}
          {!isListingsLoading && !listings?.jobs?.length && (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="Không có bài đăng khả dụng!"
                message="Hãy thử lại sau."
              />
            </Flex>
          )}
          {!isListingsLoading &&
            listings?.jobs?.map((job) => {
              return (
                <JobsCard
                  slug={job?.slug}
                  rewardAmount={job?.rewardAmount}
                  key={job?.id}
                  status={job?.status}
                  companyName={job?.company?.name}
                  deadline={job?.deadline}
                  title={job?.title}
                  logo={job?.company?.logo}
                  token={job?.token}
                  type={job?.type}
                  applicationType={job.applicationType}
                />
              );
            })}
        </ListingSection>
      </Box>
    </Home>
  );
}

export default AllListingsPage;
