import { TextInput } from 'flowbite-react';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { FaSearch } from 'react-icons/fa';

import type { GalleryCardType } from '@/lib/types';
import { filterWords } from '@/lib/utils';

import GalleryCard from '@/components/gallery/GalleryCard';
import GalleryInputCard from '@/components/gallery/GalleryInputCard';

const DUMMY: GalleryCardType[] = [
  {
    id: 1,
    image: '/static/images/gallery/sample_images_01.png',
    title: 'Sample Image 01',
    desc: '설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1설명1',
  },
  {
    id: 2,
    image: '/static/images/gallery/sample_images_02.png',
    title: 'Sample Image 02',
    desc: '설명2',
  },
  {
    id: 3,
    image: '/static/images/gallery/sample_images_03.png',
    title: 'Sample Image 03',
    desc: '설명3',
  },
  {
    id: 4,
    image: '/static/images/gallery/sample_images_04.png',
    title: 'Sample Image 04',
    desc: '설명4',
  },
  {
    id: 5,
    image: '/static/images/gallery/sample_images_05.png',
    title: 'Sample Image 05',
    desc: '설명5',
  },
  {
    id: 6,
    image: '/static/images/gallery/sample_images_06.png',
    title: 'Sample Image 06',
    desc: '설명6',
  },
  {
    id: 7,
    image: '/static/images/gallery/sample_images_07.png',
    title: 'Sample Image 07',
    desc: '설명7',
  },
  {
    id: 8,
    image: '/static/images/gallery/sample_images_08.png',
    title: 'Sample Image 08',
    desc: '설명8',
  },
  {
    id: 9,
    image: '/static/images/gallery/sample_images_09.png',
    title: 'Sample Image 09',
    desc: '설명9',
  },
  {
    id: 10,
    image: '/static/images/gallery/sample_images_10.png',
    title: 'Sample Image 10',
    desc: '설명10',
  },
  {
    id: 11,
    image: '/static/images/gallery/sample_images_11.png',
    title: 'Sample Image 11',
    desc: '설명11',
  },
  {
    id: 12,
    image: '/static/images/gallery/sample_images_12.png',
    title: 'Sample Image 12',
    desc: '설명12',
  },
];

const editCard = (
  card: Omit<GalleryCardType, 'image'> & { image: File | string }
) => {
  for (let i = 0; i < DUMMY.length; i++) {
    if (DUMMY[i].id === card.id) {
      DUMMY[i].title = card.title;
      DUMMY[i].desc = card.desc;
      DUMMY[i].image =
        typeof card.image === 'string'
          ? card.image
          : URL.createObjectURL(card.image);
      break;
    }
  }
  return DUMMY;
};
const addCard = (
  card: Omit<GalleryCardType, 'id' | 'image'> & { image: File | string }
) => {
  const newCard = {
    ...card,
    id: DUMMY.length + 1,
    image:
      typeof card.image === 'string'
        ? card.image
        : URL.createObjectURL(card.image),
  };
  DUMMY.unshift(newCard);
  return DUMMY;
};

const GalleryPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [galleryList, setGalleryList] = useState(DUMMY);
  const [editedContent, setEditedContent] = useState<
    Pick<GalleryCardType, 'title' | 'desc'> &
      Pick<Partial<GalleryCardType>, 'id'>
  >({ title: '', desc: '' });
  const [editedImage, setEditedImage] = useState<File | string | null>(null);
  const [newContent, setNewContent] = useState<
    Pick<GalleryCardType, 'title' | 'desc'>
  >({ title: '', desc: '' });
  const [newImage, setNewImage] = useState<File | string | null>(null);

  useEffect(() => {
    const filtered = filterWords<GalleryCardType>(DUMMY, 'title', searchInput);
    setGalleryList(filtered);
  }, [searchInput]);

  const onEditStart = (id: number) => {
    const target = DUMMY.find((item) => item.id === id);
    if (!target) {
      throw new Error('카드를 찾을 수 없습니다.');
    }
    setEditedImage(target.image);
    setEditedContent({ title: target.title, desc: target.desc, id });
  };

  const onWriteImage =
    (setImage: Dispatch<SetStateAction<File | string | null>>) =>
    (val: File) => {
      setImage(val);
    };

  const onWriteContents =
    (
      setContents: Dispatch<
        SetStateAction<Pick<GalleryCardType, 'title' | 'desc'>> &
          Pick<Partial<GalleryCardType>, 'id'>
      >,
      type: keyof GalleryCardType
    ) =>
    (value: string) => {
      setContents((prev) => ({
        ...prev,
        [type]: value,
      }));
    };

  const onWriteDone =
    (type: 'edit' | 'add', image: File | string) =>
    (e: FormEvent<HTMLButtonElement>, cancel?: boolean) => {
      e.preventDefault();
      if (!cancel) {
        if (!image) {
          alert('이미지를 업로드해주세요.');
          return;
        }

        const newCardList =
          type === 'edit'
            ? editCard({
                ...editedContent,
                id: editedContent.id as number,
                image,
              })
            : addCard({
                ...newContent,
                image,
              });
        setGalleryList(newCardList);
      }
      if (type === 'edit') {
        setEditedImage(null);
        setEditedContent({ title: '', desc: '' });
      } else {
        setNewImage(null);
        setNewContent({ title: '', desc: '' });
      }
    };

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-4 xl:w-11/12">
      <div>
        <TextInput
          id="search_word"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          icon={FaSearch}
          placeholder="Search"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {!searchInput && (
          <GalleryInputCard
            title={newContent.title}
            desc={newContent.desc}
            image={newImage}
            onWriteImage={onWriteImage(setNewImage)}
            onWriteTitle={onWriteContents(setNewContent, 'title')}
            onWriteDesc={onWriteContents(setNewContent, 'desc')}
            onWriteDone={onWriteDone('add', newImage as File)}
          />
        )}
        {galleryList.map((galleryCard) =>
          editedContent.id !== galleryCard.id ? (
            <GalleryCard
              key={galleryCard.id}
              onEditStart={onEditStart}
              galleryCard={galleryCard}
            />
          ) : (
            <GalleryInputCard
              key={galleryCard.id}
              title={editedContent.title}
              desc={editedContent.desc}
              image={editedImage}
              onWriteImage={onWriteImage(setEditedImage)}
              onWriteTitle={onWriteContents(setEditedContent, 'title')}
              onWriteDesc={onWriteContents(setEditedContent, 'desc')}
              onWriteDone={onWriteDone('edit', editedImage as File | string)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
