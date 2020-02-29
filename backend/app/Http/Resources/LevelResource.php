<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;


class LevelResource extends JsonResource
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
            'size'        => $this->level['size']     ?? null,
            'code'        => $this->level['code']     ?? null,
            'tiles'       => $this->level['tiles']    ?? null,
            'objects'     => $this->level['objects']  ?? null,
            'goals'       => $this->level['goals']    ?? null,
            'dialogue'    => $this->level['dialogue'] ?? null,
            'imports'     => $this->level['imports']  ?? null
        ];
    }
}
