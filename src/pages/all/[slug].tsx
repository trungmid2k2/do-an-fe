import { Box, Flex } from "@chakra-ui/react";
import type { NextPageContext } from "next";
import { useEffect, useState } from "react";

import {
  JobsCard,
  GrantsCard,
  ListingSection,
} from "@/components/misc/listingsCard";
import EmptySection from "@/components/shared/EmptySection";
import Loading from "@/components/shared/Loading";
import type { Job } from "@/interface/job";
import Home from "@/layouts/Home";
import axios from "@/lib/axios";

interface Listings {
  jobs?: Job[];
}

function ListingCategoryPage({ slug }: { slug: string }) {
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [listings, setListings] = useState<Listings>({
    jobs: [],
  });
  console.log("slug", slug);
  const getListings = async () => {
    setIsListingsLoading(true);
    const params =
      slug === "Hyperdrive"
        ? { category: "hyperdrive" }
        : { category: "all", take: 100, filter: slug };
    try {
      const listingsData = await axios.get("/api/listings", { params });
      const data = listingsData.data;
      console.log(data.data);
      setListings(data.data);
      setIsListingsLoading(false);
    } catch (e) {
      setIsListingsLoading(false);
    }
  };

  useEffect(() => {
    if (!isListingsLoading) return;
    getListings();
  }, [slug]);

  return (
    <Home type="category">
      <Box w={"100%"}>
        <ListingSection
          type="jobs"
          title={`Bài đăng về ${slug}`}
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
          {listings?.jobs?.map((job) => {
            return (
              <JobsCard
                slug={job?.slug}
                rewardAmount={job?.rewardAmount}
                key={job?.id}
                companyName={job?.company?.name}
                deadline={job?.deadline}
                title={job?.title}
                logo={job?.company?.logo}
                token={job?.token}
                type={job?.type}
                applicationType={job?.applicationType}
              />
            );
          })}
        </ListingSection>
      </Box>
    </Home>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;

  const validCategories = [
    "Design",
    "Content",
    "Development",
    "Backend",
    "Frontend",
    "jobs",
  ];

  if (!validCategories.includes(slug as string)) {
    return {
      notFound: true,
    };
  }

  return {
    props: { slug },
  };
}

export default ListingCategoryPage;
