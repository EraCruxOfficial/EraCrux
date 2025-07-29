import Header1 from '@/components/mvpblocks/header-1.tsx';
import Globe3D from '@/components/mvpblocks/3dglobe.tsx';
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@/components/ui/kibo-ui/marquee';

export default function App() {
  return (
    <div >
      <Header1 />
      <Globe3D />
      
      {/* <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent>
          {new Array(10).fill(null).map((_, index) => (
            <MarqueeItem className="h-32 w-32" key={index}>
              <img
                alt={`Placeholder ${index}`}
                className="overflow-hidden rounded-full"
                src={`/excel.png`}
              />
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee> */}
    </div>
  );
}
