"use client";

import { Text } from "@/components/text";
import { CopyField } from "@/components/brand/CopyField";
import { useCssToken } from "@/components/brand/useCssToken";
import { colorGroups, type ColorToken } from "@/constants/designTokens";

const Swatch = ({ token }: { token: ColorToken }) => {
  const color = useCssToken(token.cssVar, token.alphaVar);

  return (
    <div className="card-tbc-soft flex flex-col overflow-hidden">
      <div
        className="h-24 w-full border-b border-line-subtle"
        style={{ backgroundColor: color.ready ? color.rgbCss : "transparent" }}
        aria-hidden
      />
      <div className="flex flex-col gap-2 p-4">
        <Text textType="lgsmall" className="font-bold">
          {token.name}
        </Text>
        <Text textType="small" className="text-muted">
          {token.description}
        </Text>
        {color.ready ? (
          <div className="mt-1 flex flex-col gap-1">
            <CopyField value={token.cssVar} label="CSS variable" />
            <CopyField value={color.hex} label="hex value" />
            <CopyField value={color.rgbCss} label="rgb value" />
          </div>
        ) : (
          <Text textType="small" className="text-faint">
            Loading…
          </Text>
        )}
      </div>
    </div>
  );
};

/** groupIds lets a page show only a subset (e.g. just "brand" for the
 * public-facing partner page) instead of the full internal token set. */
export const ColorSwatches = ({ groupIds }: { groupIds?: string[] }) => {
  const groups = groupIds
    ? colorGroups.filter((g) => groupIds.includes(g.id))
    : colorGroups;

  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-4">
          {!groupIds && (
            <Text textType="sub_title" className="font-bold">
              {group.label}
            </Text>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {group.tokens.map((token) => (
              <Swatch key={token.cssVar} token={token} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
