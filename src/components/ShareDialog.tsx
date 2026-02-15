import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { JournalEntry } from '@/types/tarot';
import { ShareableCard } from './ShareableCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ShareDialogProps {
  entry: JournalEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  entry,
  open,
  onOpenChange,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Generate preview when dialog opens
  React.useEffect(() => {
    if (open && entry && cardRef.current) {
      generatePreview();
    }
    
    // Cleanup preview URL when dialog closes
    if (!open && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [open, entry]);

  const generatePreview = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch (error) {
      console.error('Failed to generate preview:', error);
      toast({
        title: '生成失敗',
        description: '無法生成分享卡片,請稍後再試。',
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !entry) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const fileName = `tarot-journal-${entry.date}-${entry.title.replace(/[^\w-]/g, '_')}.png`;
          link.download = fileName;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);

          toast({
            title: '下載成功',
            description: '分享卡片已儲存到您的裝置。',
          });
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch (error) {
      console.error('Failed to download:', error);
      toast({
        title: '下載失敗',
        description: '無法下載分享卡片,請稍後再試。',
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  };

  if (!entry) return null;

  return (
    <>
      {/* Hidden card for rendering */}
      <div className="fixed -left-[9999px] -top-[9999px]">
        <ShareableCard ref={cardRef} entry={entry} />
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
          <div className="space-y-4 p-6 bg-white/80 backdrop-blur-lg rounded-2xl border border-black/10">
            <DialogHeader className="px-2">
              <DialogTitle className="text-xl font-bold tracking-tight">分享日記卡片</DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-widest font-semibold opacity-50">
                Minimalist Export
              </DialogDescription>
            </DialogHeader>

            {/* Preview area with a soft shadow/staged look */}
            <div className="relative bg-zinc-100 rounded-xl p-4 flex items-center justify-center shadow-inner min-h-[400px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-black" />
                  <span className="mt-4 text-[10px] font-bold uppercase tracking-tighter opacity-50">Rendering...</span>
                </div>
              ) : previewUrl ? (
                <div className="shadow-2xl shadow-black/20 transform scale-95 transition-transform hover:scale-100 duration-500">
                  <img
                    src={previewUrl}
                    alt="Share card preview"
                    className="w-full h-auto rounded-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">Preparing Preview...</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isGenerating || !previewUrl}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                下載圖片
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
