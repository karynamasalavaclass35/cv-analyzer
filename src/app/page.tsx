import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <div className="p-10 bg-indigo-50">
      <main className="flex items-center justify-center w-full h-full">
        <FileUpload />
      </main>
    </div>
  );
}
