import React from "react";
import Avatar from "components/ui/avatar";
import { Badge } from "components/ui/badge";

/**
 * OverviewCard - A reusable card component for displaying profile details,
 * job postings, tasks, or other summarized information.
 *
 * Props:
 * - title (string): The main Title Text to display.
 * - className (string | null): Additional CSS classes for styling.
 * - badgeLabel (string): Text to display inside the badge.
 * - showBadge (boolean): Whether to show the badge.
 * - showAvatar (boolean): Whether to show the avatar.
 * - avatarProps (object): Contains avatar properties like `src`, `fallbackText`, and `text`.
 * - subtitle (string | null): A caption to be displayed above the title.
 * - additionalInfo (array): An array of descriptions or additional details.
 */

const OverviewCard = React.memo(
  ({
    title,
    className = "",
    badgeLabel,
    showBadge = false,
    showAvatar = true,
    avatarProps = {},
    subtitle = null,
    additionalInfo = [],
  }) => {
    return (
      <div className={`flex items-start relative ${className}`}>
        {/* Avatar Section */}
        {showAvatar && (
          <Avatar
            className={`border border-neutral-500 h-${avatarProps.size ?? "10"} w-${
              avatarProps.size ?? "10"
            }`}
            src={avatarProps.src || ""}
            fallbackText={avatarProps.fallbackText || ""}
            text={avatarProps.text || "Unknown User"}
            alt="Avatar"

          />
        )}

        {/* Text Content Section */}
        <div className="flex flex-col flex-wrap ml-2 whitespace-break-spaces self-center justify-start items-start">
          {subtitle && (
            <div className="sm:inline text-xs text-neutral-1100">
              {subtitle}
            </div>
          )}
          {title && (
            <div className="text-capitalize font-semibold text-neutral-1200">
              {title}
            </div>
          )}
          <div className="flex flex-col items-start gap-1 text-sm text-neutral-1100 md:inline">
            {additionalInfo.map((desc, index) => (
              <div key={index}>{desc}</div>
            ))}
          </div>
        </div>

        {/* Badge Section */}
        {showBadge && (
          <Badge
            variant="secondary"
            className="absolute bg-blue-100 text-blue-800 top-[-8px] left-[-8px]"
          >
            {badgeLabel}
          </Badge>
        )}
      </div>
    );
  }
);

// Export the memoized component
export default OverviewCard;
