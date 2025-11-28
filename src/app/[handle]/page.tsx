import AnonymousChat from "../home";

export default async function Page({ params }: { params: { handle: string } }) {
  const { handle } = await params;
  return (
    <div>
      <div>
        <AnonymousChat handle={handle} />
      </div>
    </div>
  );
}
