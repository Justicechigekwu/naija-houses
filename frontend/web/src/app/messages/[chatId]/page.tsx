import ChatPage from "@/components/chat/ChatPage";

export default async function SingleChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  return (
    <div className="h-[100dvh] bg-white md:hidden">
      <ChatPage chatId={chatId} showBackButton />
    </div>
  );
}