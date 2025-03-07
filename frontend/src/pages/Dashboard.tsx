import { Button } from "../components/ui/Button";
import Card from "../components/Card";
import ShareIcon from "../components/icons/ShareIcon";
import { ModalAddContent } from "../components/ModalAddContent";
import { useEffect, useState } from "react";
import { SideBar } from "../components/SideBar";
import axios from "axios";

interface Content {
  _id: string; // MongoDB ObjectId as a string
  link: string;
  type: "youtube" | "others"; // Adjust as needed
  title: string;
  tag: string[]; // Array of tags (empty or containing ObjectIds)
  userId: string; // ObjectId as a string
  userName: string; // Added `userName`
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number; // Mongoose version key
}

export const Dashboard = () => {
  const [modalOpen, setModelOpen] = useState(false);
  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true); // Store an array instead of an object
  const fetchData = async () => {
    try {
      const response = await axios.get<Content[]>(
        "http://localhost:3000/api/v1/content",
        {
          withCredentials: true,
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // Handle errors gracefully
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex flex-row">
      <ModalAddContent
        open={modalOpen}
        close={setModelOpen}
        fetchData={fetchData}
      />
      <div className="w-1/4 h-screen border-r-2 border-gray-300 rounded-sm ">
        <SideBar />
      </div>
      <div className="w-3/4 pt-3 bg-gray-100">
        <div className="flex flex-row items-center justify-between mb-7 w-auto pl-10 pr-10">
          <h1 className="text-2xl font-bold">All Notes</h1>
          <div className="flex flex-row gap-6">
            <Button
              variant="secondary"
              text="Share Brain"
              size="sm"
              startIcon={<ShareIcon size="md" />}
              onClick={async () => {
                try {
                  const response = await axios.post(
                    "http://localhost:3000/api/v1/share",
                    { share: true }, // ✅ Corrected request body
                    { withCredentials: true } // ✅ Moved to third argument
                  );
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const shareId = response.data.hash;
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const shareLink = `${window.location.origin}/brain/${shareId}`
                  await navigator.clipboard.writeText(shareLink);
                  alert("Link Copied to Clipboard");
                } catch (error) {
                  console.log("Error in share:", error);
                }
              }}
            />

            <Button
              variant="primary"
              text="Add Content"
              size="sm"
              startIcon={<ShareIcon size="md" />}
              onClick={() => {
                setModelOpen((prev) => !prev);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row gap-10 pl-10 pr-10 flex-wrap">
          {loading ? (
            <p>Loading...</p> // ✅ Show loading only while fetching data
          ) : data.length > 0 ? (
            data.map((ele) => (
              <Card
                key={ele._id}
                id={ele._id}
                title={ele.title}
                type={ele.type}
                link={ele.link}
                bool={false}
                fetchData={fetchData}
              />
            ))
          ) : (
            <p>No content available.</p> // ✅ Show this when no data is available
          )}
        </div>
      </div>
    </div>
  );
};
