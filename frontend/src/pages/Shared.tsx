import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import Card from "../components/Card";

interface Content {
  _id: string;
  link: string;
  type: "youtube" | "others";
  title: string;
  tag: string[];
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Fetched {
  content: Content[];
  ownerName: string;
}

const Shared = () => {
  const [data, setData] = useState<Fetched | null>(null);
  const [loading, setLoading] = useState(false);
  const { hash } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log(hash);
      const response = await axios.get(`http://localhost:3000/api/v1/brain/${hash}`, {
        withCredentials: true,
      });
      setData(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate("/signin");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hash) {
      fetchData();
    }
  }, [hash]);

  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <div className="w-1/4 h-screen border-r-2 border-gray-300 rounded-sm">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="w-3/4 pt-3 bg-gray-100">
        <div className="flex flex-row items-center justify-between mb-7 w-auto pl-10 pr-10">
          <h1 className="text-2xl font-bold">{`Shared By: ${data?.ownerName || "Loading..."}`}</h1>
        </div>

        {/* Content Display */}
        <div className="flex flex-row gap-10 pl-10 pr-10 flex-wrap">
          {loading ? (
            <p>Loading...</p>
          ) : data?.content.length > 0 ? (
            data?.content.map((ele) => (
              <Card key={ele._id} id={ele._id} title={ele.title} type={ele.type} link={ele.link} bool={true} />
            ))
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shared;
