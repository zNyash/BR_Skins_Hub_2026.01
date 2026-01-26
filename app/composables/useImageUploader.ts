export const useImagePreviews = () => {
  const previewCache = new Map<File, string>();

  onUnmounted(() => {
    previewCache.forEach((url) => URL.revokeObjectURL(url));
    previewCache.clear();
  });

  const getPreviewUrl = (file: File) => {
    if (previewCache.has(file)) return previewCache.get(file)!;
    const url = URL.createObjectURL(file);
    previewCache.set(file, url);
    return url;
  };

  const clearPreview = (file: File) => {
    if (previewCache.has(file)) {
      URL.revokeObjectURL(previewCache.get(file)!);
      previewCache.delete(file);
    }
  };

  return { getPreviewUrl, clearPreview };
};

export const useDragDropState = () => {
  const isDraggingOver = ref(false);
  const activeState = () => (isDraggingOver.value = true);
  const resetState = () => (isDraggingOver.value = false);
  return { isDraggingOver, activeState, resetState };
};

export const useFileHelpers = () => {
  const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return { getFileKey, formatFileSize };
};
