import { Text } from "@mantine/core";

const ChorusComponent = ({ chorus = "" }) => {
  return (
    <div className={"pl-4 border-l-4 border-blue-500"}>
      {" "}
      <Text component="pre" className="whitespace-pre-line font-sans text-lg">
        {chorus}
      </Text>
    </div>
  );
};

export default ChorusComponent;
