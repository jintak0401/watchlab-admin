import { Label, TextInput } from 'flowbite-react';
import React, { useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

import GraphModal from '@/components/graph/GraphModal';
import Modal from '@/components/Modal';
import PostEditor from '@/components/Posts/Write/PostEditor';
import ThumbnailInput from '@/components/Posts/Write/ThumbnailInput';

const PostsWritePage = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const uploadGraph = useRef<((src: string) => void) | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [contentEmpty, setContentEmpty] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center gap-4 xl:w-11/12">
        <ThumbnailInput
          className="mx-auto aspect-[191/100] w-[500px]"
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
        />
        <div>
          <Label htmlFor="post_title" value="Post Title" />
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="post_title"
            type="text"
            sizing="md"
            color="red"
            required
          />
        </div>
        <div className="h-[700px] w-full">
          <PostEditor
            editorRef={editorRef}
            setContentEmpty={setContentEmpty}
            uploadGraph={uploadGraph}
            setModalOpened={setModalOpened}
          />
        </div>
        <button
          className={`btn mx-auto w-40 bg-primary-600 ${
            loading ? 'loading' : 'btn-primary'
          }`}
          onClick={() => {
            setLoading(true);
            log();
          }}
          disabled={!thumbnail || !title || contentEmpty}
        >
          {loading ? 'Loading' : '글 등록'}
        </button>
      </div>
      <Modal opened={modalOpened}>
        <GraphModal
          closeModal={() => setModalOpened(false)}
          uploadGraph={uploadGraph.current as (src: string) => void}
        />
      </Modal>
    </>
  );
};

export default PostsWritePage;
