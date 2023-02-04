import { TextInput } from 'flowbite-react';
import { FormEvent, useEffect, useState } from 'react';
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

const GalleryPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [galleryList, setGalleryList] = useState(DUMMY);
  const [editState, setEditState] = useState<
    Pick<GalleryCardType, 'title' | 'desc' | 'id'>
  >({ title: '', desc: '', id: 0 });
  const [editImage, setEditImage] = useState<File | string | null>(null);

  useEffect(() => {
    const filtered = filterWords<GalleryCardType>(DUMMY, 'title', searchInput);
    setGalleryList(filtered);
  }, [searchInput]);

  const onEdit = (type: keyof GalleryCardType) => (value: string | File) => {
    if (type === 'image') {
      setEditImage(value as File);
    } else {
      setEditState({
        ...editState,
        [type]: value,
      });
    }
  };

  const onEditStart = (id: number) => {
    const target = DUMMY.find((item) => item.id === id);
    if (!target) {
      throw new Error('카드를 찾을 수 없습니다.');
    }
    setEditImage(target.image);
    setEditState({ title: target.title, desc: target.desc, id });
  };

  const onEditDone = (e: FormEvent<HTMLButtonElement>, cancel?: boolean) => {
    e.preventDefault();
    if (!cancel) {
      for (let i = 0; i < DUMMY.length; i++) {
        if (DUMMY[i].id === editState.id) {
          DUMMY[i].title = editState.title;
          DUMMY[i].desc = editState.desc;
          break;
        }
      }
    }
    setEditState({ title: '', desc: '', id: 0 });
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
        {galleryList.map((galleryCard) =>
          editState.id !== galleryCard.id ? (
            <GalleryCard
              key={galleryCard.id}
              onEditStart={onEditStart}
              galleryCard={galleryCard}
            />
          ) : (
            <GalleryInputCard
              key={galleryCard.id}
              title={editState.title}
              desc={editState.desc}
              image={editImage}
              onEditImage={onEdit('image')}
              onEditTitle={onEdit('title')}
              onEditDesc={onEdit('desc')}
              onEditDone={onEditDone}
            />
          )
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
