import { Text } from "@mantine/core";

const ChorusComponent = ({ chorus = "" }: { chorus: string }) => {
  return (
    <div className={"pl-4 border-l-4 border-[#E86F36] mt-2"}>
      {" "}
      <Text component="pre" className="whitespace-pre-line font-sans text-lg">
        {chorus}
      </Text>
    </div>
  );
};

export default ChorusComponent;
