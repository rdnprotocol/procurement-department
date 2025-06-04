import { Container } from "./Container";

export const Loading = () => {
  return (
    <Container>
      <div className="flex items-center justify-center min-h-[calc(100vh-360px-125px)]">
        <div className="flex gap-2">
          <div
            className="w-6 h-6 bg-[#24276B] rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-6 h-6 bg-[#24276B] rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-6 h-6 bg-[#24276B] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </Container>
  );
};
