import DeleteIcon from "./icons/DeleteIcon";
import GotoIcon from "./icons/GotoIcon";
import ArrowrightIcon from "./icons/ArrowrightIcon";
import axios from "axios";
import { TwitterEmbed } from "./TwitterEmbed";

interface CardProps {
  id: string;
  title: string;
  link: string;
  type: "youtube" | "twitter" | "others";
  bool: boolean;
  fetchData?: () => void;
}

// Function to handle YouTube Embed Conversion
const getEmbedUrl = (link: string) => {
  if (link.includes("youtu.be/")) {
    return link.replace("youtu.be/", "www.youtube.com/embed/");
  }
  if (link.includes("youtube.com/watch?v=")) {
    return link.replace("watch?v=", "embed/");
  }
  return link;
};

// Function to delete the card
const deleteCard = async (id: string, fetchData: () => void) => {
  try {
    await axios.delete("http://localhost:3000/api/v1/content", {
      data: { contentId: id },
      withCredentials: true,
    });
    console.log("Deleted ID:", id);
    fetchData(); // Ensure fetchData is a function
  } catch (err) {
    console.log("Delete Error:", err);
  }
};

const Card = (props: CardProps) => {
  return (
    <div className="max-w-72 shadow-md rounded-md outline outline-gray-200 p-4 bg-white-600">
      <div className="flex justify-between">
        <div className="flex justify-center items-center gap-3 text-gray-400">
          <ArrowrightIcon size="md" />
          <span className="font-medium text-lg text-black-600">
            {props.title}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3 text-gray-400">
          {!props.bool && props.fetchData && (
            <button onClick={() => deleteCard(props.id, props.fetchData!)}>
              <DeleteIcon size="md" />
            </button>
          )}
          <a href={props.link} target="_blank" rel="noopener noreferrer">
            <GotoIcon size="md" />
          </a>
        </div>
      </div>

      {/* YouTube Embed */}
      {props.type === "youtube" && (
        <iframe
          className="w-full pt-4"
          src={getEmbedUrl(props.link)}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      )}

      {/* Twitter Embed */}
      {props.type === "twitter" && <TwitterEmbed link={props.link.replace("x.com","twitter.com")} />}
    </div>
  );
};

export default Card;
