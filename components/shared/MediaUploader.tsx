"use client";

import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type MediaUploaerProps = {
  onValueChange?: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setImage: React.Dispatch<any>;
  publicId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  type: string;
};

const MediaUploader = ({
  // onValueChange,
  setImage,
  publicId,
  image,
  type,
}: MediaUploaerProps) => {
  // const {toast} = useToast()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUploadSuccessHandler = (result: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setImage((prev: any) => ({
      ...prev,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureUrl: result?.info?.secure_url,
    }));

    // onValueChange(result?.info?.public_id);

    // toast({
    //   title: "Image uploaded successfully",
    //   description: "You can use this image in your transformation",
    //   variant: "success",
    // });
  };

  // const onUploadErrprHandler = (result: any) => {
  //   // toast({
  //   //   title: "Error uploading image",
  //   //   description: "Please try again",
  //   //   variant: "error",
  //   // });
  // };
  return (
    <CldUploadWidget
      uploadPreset="Rady_SaasApp"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      // onError={onUploadErrprHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3>Original</h3>
          {publicId ? (
            <>
              <div className="cursor-pointer overflow-hidden rounded-[10px]">
                <CldImage
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt="Uploaded Image"
                  sizes={"(max-width: 768px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="rounded-[10px] object-cover"
                />
              </div>
            </>
          ) : (
            <div>
              <div onClick={() => open()}>
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p>
                Click here to upload an image. <br /> You can also drag and drop
              </p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
