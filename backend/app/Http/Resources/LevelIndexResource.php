<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;


class LevelIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'published'   => $this->published,

            'title'       => $this->title,
            'description' => $this->description,

            'type'        => $this->level['type']     ?? $this->type,
        ];
    }
}
