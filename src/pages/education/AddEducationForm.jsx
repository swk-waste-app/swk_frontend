import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LuSend, LuX } from 'react-icons/lu';
import { Button, Card, Field, PageHeader } from '../../components/ui';
import { apiAddEducationResource } from '../../services/education';
import { apiErrorMessage } from '../../services/ops';

// Publishes an article to the education hub (operations only).

const CATEGORIES = ['Recycling Tips', 'Composting', 'Waste Sorting', 'Sustainability', 'Workshops', 'General'];
const SUMMARY_MAX = 300;
const TAG_MAX = 40;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const IMAGE_MAX_MB = 5;

const EMPTY = { title: '', category: CATEGORIES[0], summary: '', content: '', tags: '' };

// "Plastics, sorting , plastics" becomes ["Plastics", "sorting"].
const parseTags = (text) => {
  const seen = new Set();
  return text.split(',').map((tag) => tag.trim()).filter((tag) => {
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const validate = (values) => {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Enter a title.';
  if (!values.summary.trim()) errors.summary = 'Enter a short summary.';
  if (!values.content.trim()) errors.content = 'Write the article.';
  if (parseTags(values.tags).some((tag) => tag.length > TAG_MAX)) {
    errors.tags = `Keep each tag to ${TAG_MAX} characters or fewer.`;
  }
  return errors;
};

const imageProblem = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return 'Choose a JPEG, PNG or WebP image.';
  if (file.size > IMAGE_MAX_MB * 1024 * 1024) return `Choose an image smaller than ${IMAGE_MAX_MB} MB.`;
  return '';
};

const AddEducationForm = () => {
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const change = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const clearImage = () => {
    setImage(null);
    if (fileInput.current) fileInput.current.value = '';
  };

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    const problem = file ? imageProblem(file) : '';
    setErrors((current) => ({ ...current, image: problem }));
    if (file && !problem) setImage(file);
    else clearImage();
  };

  const publish = async (event) => {
    event.preventDefault();
    if (saving) return;

    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`article-${firstInvalid}`)?.focus();
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title.trim());
    formData.append('category', values.category);
    formData.append('summary', values.summary.trim());
    formData.append('content', values.content.trim());
    parseTags(values.tags).forEach((tag) => formData.append('tags', tag));
    if (image) formData.append('image', image);

    setSaving(true);
    try {
      await apiAddEducationResource(formData);
      toast.success('Article published');
      navigate('/education');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'The article could not be published. Try again.'));
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Publish article"
        description="Add a guide, tip or workshop update to the education hub. It is visible to everyone as soon as it is published."
      />

      <Card className="max-w-3xl p-5 sm:p-6">
        <form onSubmit={publish} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
            <Field label="Title" htmlFor="article-title" error={errors.title}>
              <input
                id="article-title"
                name="title"
                className="input"
                maxLength={140}
                placeholder="e.g. Five ways to sort household waste"
                value={values.title}
                onChange={change}
                aria-invalid={Boolean(errors.title)}
              />
            </Field>
            <Field label="Category" htmlFor="article-category">
              <select id="article-category" name="category" className="input" value={values.category} onChange={change}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </Field>
          </div>

          <Field
            label="Summary"
            htmlFor="article-summary"
            error={errors.summary}
            hint={`Shown on the article list. ${values.summary.length} of ${SUMMARY_MAX} characters used.`}
          >
            <textarea
              id="article-summary"
              name="summary"
              className="input resize-none"
              rows={2}
              maxLength={SUMMARY_MAX}
              value={values.summary}
              onChange={change}
              aria-invalid={Boolean(errors.summary)}
            />
          </Field>

          <Field label="Content" htmlFor="article-content" error={errors.content} hint="Leave a blank line between paragraphs.">
            <textarea
              id="article-content"
              name="content"
              className="input"
              rows={12}
              value={values.content}
              onChange={change}
              aria-invalid={Boolean(errors.content)}
            />
          </Field>

          <Field
            label="Cover image"
            htmlFor="article-image"
            optional
            error={errors.image}
            hint={`JPEG, PNG or WebP, up to ${IMAGE_MAX_MB} MB.`}
          >
            <input
              id="article-image"
              ref={fileInput}
              type="file"
              accept={IMAGE_TYPES.join(',')}
              onChange={chooseImage}
              className="input file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 dark:file:bg-gray-800 dark:file:text-gray-200"
            />
            {preview && (
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={preview}
                  alt="Preview of the cover image"
                  className="h-28 w-44 rounded-lg border border-gray-200 object-cover dark:border-gray-800"
                />
                <Button variant="ghost" size="sm" icon={LuX} onClick={clearImage}>Remove image</Button>
              </div>
            )}
          </Field>

          <Field
            label="Tags"
            htmlFor="article-tags"
            optional
            error={errors.tags}
            hint="Separate tags with commas, for example: plastics, sorting."
          >
            <input
              id="article-tags"
              name="tags"
              className="input"
              value={values.tags}
              onChange={change}
              aria-invalid={Boolean(errors.tags)}
            />
          </Field>

          <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button as={Link} to="/education" variant="secondary">Cancel</Button>
            <Button type="submit" icon={LuSend} loading={saving}>Publish article</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEducationForm;
