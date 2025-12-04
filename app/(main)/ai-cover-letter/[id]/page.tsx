
export default async function CoverLetter({ params }: { params: { id: string } }) {
 

  const id = await   params.id;
   console.log("PARAMS:", params);

  return (
    <div className="text-white">
      Cover letter: {id}
    </div>
  );
}
