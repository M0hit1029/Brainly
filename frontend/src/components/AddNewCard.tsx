import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define form data type
interface FormData {
  link: string;
  title: string;
  type: "youtube" | "twitter" | "";
}

interface AddNewCardProps {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  func: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AddNewCard = (props: AddNewCardProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/v1/content", data, {
        withCredentials: true,
      });
      alert("Submitted Successfully");
      props.close(false);
      props.func();
      reset();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
      {/* Link Input with Validation */}
      <input
        {...register("link", {
          required: "Link is required",
          pattern: {
            value:
              /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/, // URL regex
            message: "Enter a valid URL",
          },
        })}
        placeholder="Link"
      />
      {errors.link && <span className="text-red-500">{errors.link.message}</span>}

      {/* Title Input */}
      <input
        {...register("title", { required: "Title is required" })}
        placeholder="Title"
      />
      {errors.title && <span className="text-red-500">{errors.title.message}</span>}

      {/* Select Input */}
      <select {...register("type", { required: "Type is required" })}>
        <option value="">Select an Option</option>
        <option value="youtube">Youtube</option>
        <option value="twitter">Twitter</option>
      </select>
      {errors.type && <span className="text-red-500">{errors.type.message}</span>}

      {/* Submit Button */}
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
