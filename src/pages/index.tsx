import { twMerge } from "tailwind-merge";

export default function Home() {
  const randomBoolean = Math.random() > 0.5;

  return (
    <main
      className={`${
        randomBoolean ? "text-red-500" : "text-red-800"
      } flex min-h-screen flex-col items-center whitespace-nowrap justify-between p-24 ${
        randomBoolean ? "text-red-500" : "text-red-800"
      }`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="text-green-600">Not empty literal className</p>
        <p className="">Empty literal className</p>
        <p className={""}>JSXExpression empty className</p>
        <p className={`text-blue-700 ${true ? "font-semibold" : ""}`}>
          JSXExpression template className
        </p>
        <p
          className={`text-blue-700 ${
            true ? (true ? "font-semibold" : "bg-black") : ""
          }`}
        >
          JSXExpression multiple template className
        </p>
        <p
          className={twMerge(
            "text-nowrap text-yellow-600",
            `font-semibold`,
            randomBoolean && "text-center",
            randomBoolean && randomBoolean && "text-center bg-inherit",
            randomBoolean && `text-center`,
            randomBoolean &&
              (!randomBoolean
                ? `${
                    randomBoolean ? `whitespace-normal` : "whitespace-nowrap"
                  } text-red-50`
                : "text-green-50"),
            randomBoolean ? "text-red-50" : "text-green-50",
            randomBoolean
              ? true
                ? `text-wrap`
                : "text-red-50"
              : "text-green-50"
          )}
        >
          TwMerge className
        </p>
      </div>
    </main>
  );
}
