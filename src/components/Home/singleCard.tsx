import Image from "next/image";

const SingleCard = ({ info }: any) => {
  return (
    <div>
      {info.length &&
        info?.map((item: any) => {
          <Image
            src={item?.image_url}
            width={100}
            height={100}
            alt="login image"
          />;
        })}
    </div>
  );
};

export default SingleCard;
