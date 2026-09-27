"use client";

interface Folder {
  name: string;
  count: number;
}

interface ClassificationSummaryProps {
  folders: Folder[];
  totalImages: number;
}

// Same fixed colors je aapan FolderManager madhe vaparle ahet
const FOLDER_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-purple-500",
];

export default function ClassificationSummary({
  folders,
  totalImages,
}: ClassificationSummaryProps) {
  const classifiedCount = folders.reduce(
    (total, folder) => total + folder.count,
    0
  );

  const remaining = totalImages - classifiedCount;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold text-card-foreground">
        Classification Summary
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Total Images
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totalImages}
          </p>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Classified
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {classifiedCount}
          </p>
        </div>

        <div className="col-span-2 rounded-lg bg-muted p-4 border-l-4 border-primary/50">
          <p className="text-sm text-muted-foreground">
            Remaining
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {Math.max(remaining, 0)}
          </p>
        </div>
      </div>

      {folders.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Folder Breakdown
          </h3>
          {folders.map((folder, index) => {
            const colorClass = FOLDER_COLORS[index % 5];
            
            return (
              <div
                key={folder.name}
                className="flex items-center justify-between border-b border-border pb-2 last:border-0"
              >
                <div className="flex items-center gap-2">
                  {/* Color dot for visual consistency */}
                  <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
                  <span className="text-sm text-foreground font-medium">
                    {folder.name}
                  </span>
                </div>

                <span className="text-sm font-semibold bg-muted px-2 py-0.5 rounded-full text-foreground">
                  {folder.count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}