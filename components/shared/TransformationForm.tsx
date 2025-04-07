"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { defaultValues } from "@/constants";
import { TransformationFormProps, Transformations } from "@/types";
import { CustomField } from "./CustomField";
import { startTransition, useState } from "react";
import { deepMergeObjects } from "@/lib/utils";

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const TransformationForm = ({
  action,
  data = null,
  // creditBalance,
  // type,
  // userId,
  config,
}: TransformationFormProps) => {
  // const transformationType = transformationTypes[type];
  // const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  // const [isPending, setIsPending] = useTransition();

  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  // const onSelectFieldHandler = (
  //   value: string,
  //   onChangeField: (value: string) => void
  // ) => {
  //   const imageSiaze = aspectRatioOptions[value as AspectRatioKey];
  //   setImage((prev: any) => ({
  //     ...prev,
  //     aspectRatio: imageSiaze.aspectRatio,
  //     width: imageSiaze.width,
  //     height: imageSiaze.height,
  //   }));

  //   console.log("image :", image);

  //   setNewTransformation(transformationType.config);

  //   return onChangeField(value);
  // };

  // const onInputChangeHandler = (
  //   fieldName: string,
  //   value: string,
  //   type: string,
  //   onChangeField: (vlue: string) => void
  // ) => {
  //   debounce(() => {
  //     setNewTransformation((prev: any) => ({
  //       ...prev,
  //       [type]: { ...prev?.[type] },
  //       [fieldName === "prompt" ? "prompt" : "to"]: value,
  //     }));

  //     return onChangeField(value);
  //   }, 1000);
  // };

  const onTransformationHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    );

    setNewTransformation(null);

    startTransition(async () => {
      // await updateCredits(userId,creditFee)
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => (
            <Input
              className="input-field"
              placeholder="Image Title"
              {...field}
            />
          )}
        />

        {/* {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => {
                    return (
                      <SelectItem key={key} value={key}>
                        {aspectRatioOptions[key as AspectRatioKey].label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {type === "remove" ||
          (type === "recolor" && (
            <div>
              <CustomField
                control={form.control}
                name="color"
                formLabel={type === "remove" ? "Remove Color" : "Recolor Color"}
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={(e) =>
                      onInputChangeHandler(
                        e,
                        "prompt",
                        e.target.value,
                        type,
                        field.onChange
                      )
                    }
                    className="input-field"
                  />
                )}
              />

              {type === "recolor" && (
                <CustomField
                  control={form.control}
                  name="color"
                  formLabel="Recolor Color"
                  className="w-full"
                  render={({ field }) => (
                    <Input
                      value={field.value}
                      onChange={(e) =>
                        onInputChangeHandler(
                          e,
                          "color",
                          e.target.value,
                          "recolor",
                          field.onChange
                        )
                      }
                      className="input-field"
                    />
                  )}
                />
              )}
            </div>
          ))} */}

        {/* <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                type={type}
              />
            )}
          />
        </div> */}

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformationHandler}
          >
            {isTransforming ? "Transforming..." : "Apply Transformion"}
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
