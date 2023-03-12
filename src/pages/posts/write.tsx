import { Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { TagsInput } from 'react-tag-input-component';
import { toast } from 'react-toastify';
import { Editor as TinyMCEEditor } from 'tinymce';

import {
  GalleryCardType,
  GalleryType,
  PostType,
  WriterType,
} from '@/lib/types';
import { usePostAddMutate, usePostUpdateMutate } from '@/hooks/rq/post';
import { useWriterQuery } from '@/hooks/rq/writer';
import useIsBrowser from '@/hooks/useIsBrowser';

import GalleryModal from '@/components/gallery/GalleryModal';
import GraphModal from '@/components/graph/GraphModal';
import Modal from '@/components/Modal';
import PostEditor from '@/components/Posts/Write/PostEditor';
import SelectWriterButton from '@/components/Posts/Write/SelectWriterButton';
import SelectWriterModal from '@/components/Posts/Write/SelectWriterModal';
import ThumbnailInput from '@/components/Posts/Write/ThumbnailInput';

const DEFAULT_POST: Pick<PostType, 'title' | 'slug' | 'tags'> = {
  title: '',
  slug: '',
  tags: [],
};

const WRITER_MODAL = 'writer';
const GRAPH_MODAL = 'graph';
const GALLERY_MODAL = 'gallery';

interface Props {
  postProps?: PostType;
}

const PostsWritePage = ({ postProps }: Props) => {
  const router = useRouter();
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const uploadGraph = useRef<((src: string) => void) | null>(null);
  const uploadGallery = useRef<((gallery: GalleryCardType) => void) | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [openedModal, setOpenedModal] = useState<
    'writer' | 'graph' | 'gallery' | ''
  >('');
  const [thumbnail, setThumbnail] = useState<string | File | null>(null);
  const [post, setPost] = useState<Pick<PostType, 'title' | 'slug' | 'tags'>>({
    ...DEFAULT_POST,
  });
  const [selectedWriter, setSelectedWriter] = useState<WriterType | null>(null);
  const { data: totalWriterList } = useWriterQuery();
  const isBrowser = useIsBrowser();
  const { mutateAsync: addPost } = usePostAddMutate(router.locale);
  const { mutateAsync: updatePost } = usePostUpdateMutate(
    router.locale,
    postProps?.slug
  );
  const [contentEmpty, setContentEmpty] = useState(true);

  const isValidSlug = (slug: string) => {
    const regex = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
    return regex.test(slug);
  };

  const getPostContent = () => {
    return editorRef.current?.getContent() ?? '';
  };

  const uploadPost = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (thumbnail === null) {
      throw new Error('No thumbnail');
    } else if (selectedWriter === null) {
      throw new Error('No writer');
    }
    try {
      setLoading(true);
      const content = getPostContent();
      const data = {
        ...post,
        writer: selectedWriter.name,
        thumbnail,
        content: content === postProps?.content ? undefined : content,
      };
      if (postProps) {
        await updatePost(data);
      } else {
        await addPost(data);
      }
      toast.success('Post uploaded successfully');
      router.push('/posts');
    } catch (e) {
      toast.error('Error while adding post');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postProps && totalWriterList) {
      const { writer, thumbnail, content, view, ...rest } = postProps;
      setPost({ ...rest });
      setThumbnail(thumbnail);
      const _writer = totalWriterList.find((w) => w.name === writer.name);
      setSelectedWriter(_writer ?? null);
    }
  }, [postProps, totalWriterList]);

  return (
    <>
      <form className="mx-auto flex w-full flex-col justify-center gap-4 xl:w-11/12">
        <Label htmlFor="post_thumbnail" value="Thumbnail" />
        <ThumbnailInput thumbnail={thumbnail} setThumbnail={setThumbnail} />
        <div className="grid grid-cols-4 items-center">
          <div className="col-span-1">
            <Label htmlFor="post_writer" value="Writer" />
            <SelectWriterButton
              onClick={() => setOpenedModal(WRITER_MODAL)}
              writer={selectedWriter}
            />
          </div>
          <div className="col-span-3">
            <Label
              htmlFor="post_slug"
              value="Slug (only valid a(A) ~ z(Z), 0 ~ 9, '-' / ex. hello-what-is-your-name)"
            />
            <TextInput
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              id="post_slug"
              sizing="md"
              type="text"
              color="red"
              pattern="[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="post_title" value="Post Title" />
          <TextInput
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            id="post_title"
            type="text"
            sizing="md"
            color="red"
            required
          />
        </div>
        <div>
          <Label htmlFor="post_tags" value="Post Tags" />
          <TagsInput
            value={post.tags}
            onChange={(tags) => setPost({ ...post, tags })}
            name="post_tags"
            placeHolder="enter tags"
          />
        </div>
        <div className="flex h-[1000px] w-full items-center justify-center">
          <PostEditor
            setContentEmpty={setContentEmpty}
            editorRef={editorRef}
            uploadGraph={uploadGraph}
            uploadGallery={uploadGallery}
            openModal={(mode) => setOpenedModal(mode)}
            initText={postProps?.content}
          />
        </div>
        <button
          type="submit"
          className={`btn mx-auto w-40 bg-primary-600 ${
            loading ? 'loading' : 'btn-primary'
          }`}
          onClick={uploadPost}
          disabled={
            !thumbnail ||
            !post.title ||
            !selectedWriter ||
            !isValidSlug(post.slug) ||
            contentEmpty
          }
        >
          {loading ? 'Loading' : 'Submit'}
        </button>
      </form>
      {isBrowser && (
        <>
          <Modal opened={openedModal === GALLERY_MODAL}>
            <GalleryModal
              closeModal={() => setOpenedModal('')}
              uploadGallery={
                uploadGallery.current as (gallery: GalleryType) => void
              }
            />
          </Modal>
          <Modal opened={openedModal === GRAPH_MODAL}>
            <GraphModal
              closeModal={() => setOpenedModal('')}
              uploadGraph={uploadGraph.current as (src: string) => void}
            />
          </Modal>
          <SelectWriterModal
            open={openedModal === WRITER_MODAL}
            onSelect={(writer: WriterType) => {
              setSelectedWriter(writer);
              setOpenedModal('');
            }}
            onClose={() => setOpenedModal('')}
          />
        </>
      )}
    </>
  );
};

export default PostsWritePage;
